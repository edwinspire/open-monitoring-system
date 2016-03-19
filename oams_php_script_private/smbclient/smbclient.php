<?php
/**
 * Class for interacting with an SMB server using the system command "smbclient".
 * Of course this assumes that you have the smbclient executable installed and
 * in your path.
 *
 * It is not the most efficient way of interacting with an SMB server -- for instance,
 * putting multiple files involves running the executable multiple times and
 * establishing a connection for each file.  However, if performance is not an
 * issue, this is a quick-and-dirty way to move files to and from the SMB
 * server from PHP.
 *
 * Note that this library relies heavily on the exit code from smbclient to determine
 * success/failure of operations.  Unfortunately, smbclient is not very good about
 * using the error codes.  A "put" command that cannot write will return an exit code
 * of "1", but a "del" command on a non-existent file will exit with a status of 0.
 *
 * So this method is imperfect.  Better would be to actually parse the output of
 * smbclient even when the exit status is 0 to see if there are codes like
 * NT_STATUS_NO_SUCH_FILE or NT_STATUS_OBJECT_NAME_NOT_FOUND
 */
class smbclient
{
    // when doing "safe" puts, how many times are we willing to retry if we
    // fail to send?  And how long (in ms) to wait between retries
    private $_max_safe_retries = 3;
    private $_safe_retry_interval = 200;

    public static $debug_mode = false;
    public static $debug_label = 'smbclient';

    private $_service;
    private $_username;
    private $_password;
    
    private $_cmd;
    
    /**
     * Gets the most recently executed command string
     *
     * @return string
     */
    public function get_last_cmd () { return $this->_cmd; }
        
    private $_last_cmd_stdout;
    /**
     * Gets stndard output from the last run command; can be useful in
     * case the command reports an error; smbclient writes a lot of
     * diagnostics to stdout.
     *
     * @return array each line of stdout is one string in the array
     */
    public function get_last_cmd_stdout () { return $this->_last_cmd_stdout; }
    
    private $_last_cmd_stderr;
    /**
     * Gets stndard error from the last run command
     *
     * @return array each line of stderr is one string in the array
     */
    public function get_last_cmd_stderr () { return $this->_last_cmd_stderr; }

    private $_last_cmd_exit_code;
    /**
     * Gets the exit code of the last command run
     *
     * @return int
     */
    public function get_last_cmd_exit_code () { return $this->_last_cmd_exit_code; }

    private $_safe_retry_count = 0;
    /**
     * Gets the retry count of the last safe_put() operation; if it
     * succeeded on the first try, retry count is 0
     *
     * @return int
     */
    public function get_safe_retry_count () { return $this->_safe_retry_count; }
    
    /**
     * Creates an smbclient object
     *
     * @param string $service the UNC service name
     * @param string $username the username to use when connecting
     * @param string $password the password to use when connecting
     */
    public function __construct ($service, $username, $password)
    {
        $this->_service = $service;
        $this->_username = $username;
        $this->_password = $password;
    }
    

    /**
     * Gets a remote file
     *
     * @param string $remote_filename remote filename (use the local system's directory separators)
     * @param string $local_filename the full path to the local filename
     * @return bool true if successful, false otherwise
     */
    public function get ($remote_filename, $local_filename)
    {
        // convert to windows-style backslashes
        $remote_filename = str_replace (DIRECTORY_SEPARATOR, '\\', $remote_filename);
        
        $cmd = "get \"$remote_filename\" \"$local_filename\"";
        
        $retval = $this->execute ($cmd);
        return $retval;
    }

    /**
     * Puts multiple local files on the server
     *
     * @param array $local_files array of local filename paths
     * @param string $remote_path path to remote directory (use the local system's directory separators)
     * @param bool $safe use safe_put() instead of put ()
     * @return bool true if successful, false otherwise
     */
    public function mput ($local_files, $remote_path, $safe = false)
    {
        foreach ($local_files as $local_file)
        {
            $pi = pathinfo ($local_file);
            
            $remote_file = $remote_path . '/' . $pi['basename'];
            
            if ($safe)
            {
                if (!$this->safe_put ($local_file, $remote_file))
                {
                    return false;
                }
            }
            else
            {
                if (!$this->put ($local_file, $remote_file))
                {
                    return false;
                }
            }
        }
        
        return true;
    }

    /**
     * Puts a local file
     *
     * @param string $local_filename the full path to local filename
     * @param string $remote_filename (use the local system's directory separators)
     * @return bool true if successful, false otherwise
     */
    public function put ($local_filename, $remote_filename)
    {
        // convert to windows-style backslashes
        $remote_filename = str_replace (DIRECTORY_SEPARATOR, '\\', $remote_filename);
        
        $cmd = "put \"$local_filename\" \"$remote_filename\"";
        
        $retval = $this->execute ($cmd);
        return $retval;
    }

    /**
     * Safely puts a local file; it writes to a temporary file, retrieves
     * that file, compares checksum to the original local file, then if
     * everything checks out, renames the remote temporary file to its
     * final remote filename.
     *
     * @param string $local_filename the full path to local filename
     * @param string $remote_filename (use the local system's directory separators)
     * @return bool true if successful, false otherwise
     */
    public function safe_put ($local_filename, $remote_filename)
    {
        // I wanted to write to a temp file on the remote system, then rename the
        // file, but Windows won't let you do that.  So all I can do is write to
        // the permanent file, then check its contents immediately.  Two problems
        // with this:
        //  - if the data transfer doesn't work, I've now wrecked the file
        //  - if another process writes to the file between the time I send
        //    the data and the time I read it, I'm going to think the data
        //    transfer failed.
        //
        // all the commented-out code was designed to use this strategy, before
        // I found that it doesn't work.  :-(

        //$tmp_remote_filename = $remote_filename . '.' . uniqid () . '.tmp';
        $tmp_local_filename = tempnam(sys_get_temp_dir(), 'safe_put');

        $local_crc = crc32 (file_get_contents ($local_filename));

        $success = false;
        $this->_safe_retry_count = 0;
        while (!$success)
        {
            self::log_msg ("retry count: " . $this->_safe_retry_count);
            //if ($this->put ($local_filename, $tmp_remote_filename))
            if ($this->put ($local_filename, $remote_filename))
            {
                //if ($this->get ($tmp_remote_filename, $tmp_local_filename))
                if ($this->get ($remote_filename, $tmp_local_filename))
                {
                    self::log_msg ("contents: '" . file_get_contents ($tmp_local_filename) . "'");
                    if (crc32 (file_get_contents ($tmp_local_filename)) == $local_crc)
                    {
                        unlink ($tmp_local_filename);
                        self::log_msg ("retrieved file matches CRC32");
                        $success = true;
                        return true;
                        /*
                        if ($this->rename ($tmp_remote_filename, $remote_filename))
                        {
                            $success = true;
                            return true;
                        }
                        else
                        {
                            array_unshift ($this->_last_cmd_stderr,  "safe_put() failed to rename file");
                        }
                        */
                    }
                    else
                    {
                        self::log_msg ("retrieved file does not match CRC32");
                        array_unshift ($this->_last_cmd_stderr, "safe_put() failed to validate checksum of $tmp_remote_filename");

                        /*
                        if (!$this->del ($tmp_remote_filename))
                        {
                            array_unshift ($this->_last_cmd_stderr, "safe_put() failed to validate checksum of $tmp_remote_filename and failed to delete it from remote machine: " . $this->_last_cmd_stderr);
                        }
                        */
                    }

                    unlink ($tmp_local_filename);
                }

            }

            if ($this->_safe_retry_count > $this->_max_safe_retries)
            {
                self::log_msg ("out of retries");
                break;
            }

            $this->_safe_retry_count++;
            usleep ($this->_safe_retry_interval);
        }

        unlink ($tmp_local_filename);
        return false;
    }
    
    /**
     * Renames a remote file
     *
     * @param string $source_filename the remote source file (use the local system's directory separators)
     * @param string $dest_filename the remote destination file (use the local system's directory separators)
     * @return bool true if successful, false otherwise
     */
    public function rename ($source_filename, $dest_filename)
    {
        // convert to windows-style backslashes
        $source_filename = str_replace (DIRECTORY_SEPARATOR, '\\', $source_filename);
        $dest_filename = str_replace (DIRECTORY_SEPARATOR, '\\', $dest_filename);
        
        $cmd = "rename \"$source_filename\" \"$dest_filename\"";
        
        $retval = $this->execute ($cmd);
        return $retval;
    }
    
    /**
     * Deletes a remote file
     *
     * Note:  due to limitations in smbclient, if the remote filename specifies a path,
     * we can't do this in one command; instead, we need to break it into a cd and then a del.
     * This is unfortunate, because if the path is specified incorrectly, and the cd fails,
     * we may delete the wrong file.
     *
     * @param string $remote_filename (use the local system's directory separators)
     * @return bool true if successful, false otherwise
     */
    public function del ($remote_filename)
    {
        $pi = pathinfo ($remote_filename);
        $remote_path = $pi['dirname'];
        $basename = $pi['basename'];
        
        // convert to windows-style backslashes
        if ($remote_path)
        {
            $remote_path = str_replace (DIRECTORY_SEPARATOR, '\\', $remote_path);
            $cmd = "cd \"$remote_path\"; del \"$basename\"";
        }
        else
        {
            $cmd = "del \"$basename\"";
        }
        
        $retval = $this->execute ($cmd);
        return $retval;
    }
    
    /**
     * Makes a directory
     *
     * @param string $remote_path (use the local system's directory separators)
     * @return bool true if successful, false otherwise
     */
    public function mkdir ($remote_path)
    {
        $remote_path = str_replace (DIRECTORY_SEPARATOR, '\\', $remote_path);
        $cmd = "mkdir \"$remote_path\"";
        
        $retval = $this->execute ($cmd);
        return $retval;
    }
    
    
    /**
     * Lists the contents of a directory on the remote server;
     * Results are returned in an array of arrays.  Each subarray has the
     * following hash key values:
     *
     * filename - name of the file
     * size     - size in bytes
     * mtime    - UNIX timestamp of file's modification time
     * isdir    - boolean indicating whether the file is a directory
     *
     * Note -- parsing smbclient "dir" output is inexact.  Filenames with leading
     * or trailing whitespace will lose these characters.
     *
     * @param string $remote_path
     * @return mixed array of results if successful, false otherwise
     */
    public function dir ($remote_path = '', $remote_filename = '')
    {
        // convert to windows-style backslashes
        if ($remote_path)
        {
            $remote_path = str_replace (DIRECTORY_SEPARATOR, '\\', $remote_path);
            if ($remote_filename)
            {
                $cmd = "cd \"$remote_path\"; dir \"{$remote_filename}\"";
            }
            else
            {
                $cmd = "cd \"$remote_path\"; dir";
            }
        }
        else
        {
            if ($remote_filename)
            {
                $cmd = "dir \"{$remote_filename}\"";
            }
            else
            {
                $cmd = "dir";
            }
        }
        
        $retval = $this->execute ($cmd);
        if (!$retval)
        {
            return $retval;
        }
        
        $xary = array ();
        foreach ($this->_last_cmd_stdout as $line)
        {
            if (!preg_match ('#\s+(.+?)\s+(.....)\s+(\d+)\s+(\w+\s+\w+\s+\d+\s+\d\d:\d\d:\d\d\s\d+)$#', $line, $matches))
            {
                continue;
            }
            
            list ($junk, $filename, $status, $size, $mtime) = $matches;
            $filename = trim ($filename);
            $status = trim ($status);
            $mtime = strtotime($mtime);
            
            $isdir = (stripos ($status, 'D') !== false) ? true : false;
            
            $xary[] = array ('filename' => $filename, 'size' => $size, 'mtime' => $mtime, 'isdir' => $isdir);
        }
        
        return $xary;
    }
    
    private function execute ($cmd)
    {
        $this->build_full_cmd($cmd);

        self::log_msg ($this->_cmd);
        
        $outfile = tempnam(".", "cmd");
        $errfile = tempnam(".", "cmd");
        $descriptorspec = array(
            0 => array("pipe", "r"),
            1 => array("file", $outfile, "w"),
            2 => array("file", $errfile, "w")
        );
        $proc = proc_open($this->_cmd, $descriptorspec, $pipes);
       
        if (!is_resource($proc)) return 255;
    
        fclose($pipes[0]);    //Don't really want to give any input
    
        $exit = proc_close($proc);
        $this->_last_cmd_stdout = file($outfile);
        $this->_last_cmd_stderr = file($errfile);
        $this->_last_cmd_exit_code = $exit;

        self::log_msg ("exit code: " . $this->_last_cmd_exit_code);
        self::log_msg ("stdout: " . join ("\n", $this->_last_cmd_stdout));
        self::log_msg ("stderr: " . join ("\n", $this->_last_cmd_stderr));
    
        unlink($outfile);
        unlink($errfile);
        
        if ($exit)
        {
            return false;
        }
        return true;
    }
    
    private function build_full_cmd ($cmd = '')
    {
        $this->_cmd = "smbclient '" . $this->_service . "'";
        
        $this->_cmd .= " -U '" . $this->_username . "%" . $this->_password . "'";
        
        if ($cmd)
        {
            $this->_cmd .= " -c '$cmd'";
        }
    }

    /**
     * Logs a message if debug_mode is true and if there is a global "log_msg" function.
     * @param string $msg the message to log
     */
    private static function log_msg ($msg)
    {
        if (!self::$debug_mode)
        {
            return;
        }

        if (function_exists ('log_msg'))
        {
            log_msg ('[' . self::$debug_label . "] $msg");
        }
    }
}


?>

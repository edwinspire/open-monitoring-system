public static int main (string[] args) {

  if(args.length > 2){

    var MJS = new MountJS(args);

    MJS.mount();

    VolumeMonitor monitor = VolumeMonitor.get ();

    monitor.mount_added.connect ((mount) => {
        MJS.json(mount);
        });

    MJS.MLoop.run ();
    return 0;

    }else{
        stdout.printf  ("""{"error": {"code": 6, "message": "%s"}}""", "Params not found");
        return 1;
    }

}





public class MountJS : GLib.Object {

    public MainLoop MLoop = new MainLoop ();
    private string Protocol = "";
    private string Location = "";
    private string UserName = "";
    private string Password = "";
    private string Domain = "";
    private bool Anonymous = true;
    private File location;
    private int MOUNT_TIMEOUT_SEC = 60;

    public MountJS(string[] args){

        var i = 0;
        foreach (var a in args) { 

           switch(i){
            case 1:
            this.Protocol = a;
            break;
            case 2:
            this.Domain = a;
            break;
            case 3:
            this.Location = a;
            break;
            case 4:
            if(a == "true" || a == "TRUE"){
                this.Anonymous = true;
                }else{
                    this.Anonymous = false;
                }
                break;
                case 5:
                this.UserName = a;
                break;
                case 6:
                this.Password = a;
                break;
                case 7:
                this.MOUNT_TIMEOUT_SEC = int.parse(a);
                if(this.MOUNT_TIMEOUT_SEC < 1){
                    this.MOUNT_TIMEOUT_SEC = 1;
                }
                break;
            }

            i++;
        }

    }


    public async void mount(){

        if(this.UserName.length > 0){
            this.location = GLib.File.new_for_uri (this.Protocol+"://"+this.UserName+"@"+this.Location);
            }else{
                this.location = GLib.File.new_for_uri (this.Protocol+"://"+this.Location);
            }


            bool res = false;
            MountOperation? mount_op = null;
            var cancellable = new Cancellable ();
            uint mount_timeout_id = 100;

            mount_timeout_id = Timeout.add_seconds (MOUNT_TIMEOUT_SEC, () => {
                cancellable.cancel ();
                return true;
                });


            try {

                mount_op = new MountOperation ();

                mount_op.ask_password.connect ((message, default_user, default_domain, flags) => {
                    mount_op.reply(MountOperationResult.HANDLED );
                    });

                mount_op.anonymous = this.Anonymous;

                if(!mount_op.anonymous){
                    mount_op.username = this.UserName;
                    mount_op.password = this.Password;
                }

                if(this.Domain != ""){
                    mount_op.domain = this.Domain;
                }

                res = yield location.mount_enclosing_volume (GLib.MountMountFlags.NONE, mount_op, cancellable);

                } catch (Error e) {

                 if (e is IOError.ALREADY_MOUNTED) {

                    try {
                        this.json(this.location.find_enclosing_mount ());
                        } catch (Error e) {
                         stdout.printf  ("""{"error": {"code": 4, "message": "%s"}, "params": %s}""", e.message, this.get_param());
                     }

                     } else if (e is IOError.NOT_FOUND) {

                        try {
                            yield location.mount_mountable (GLib.MountMountFlags.NONE, mount_op, null);
                            res = true;
                            } catch (GLib.Error e2) {
                                stdout.printf  ("""{"error": {"code": 5, "message": "%s"}, "params": %s}""", "Unable to mount mountable", this.get_param());
                                res = false;
                            }

                            } else {

                                if (e is IOError.PERMISSION_DENIED) {
                                    stdout.printf  ("""{"error": {"code": 3, "message": "%s"}, "params": %s}""", "PERMISSION_DENIED", this.get_param());
                                    }else if(e is IOError.FAILED_HANDLED) {
                                        stdout.printf  ("""{"error": {"code": 2, "message": "%s"}, "params": %s}""", "FAILED_HANDLED", this.get_param());
                                        }else{
                                            stdout.printf  ("""{"error": {"code": 1, "message": "%s"}, "params": %s}""", e.message, this.get_param());
                                        }

                                    }

                                    this.MLoop.quit ();

                                    } finally {
                                        this.MLoop.quit ();
                                    }

                                }

                                public string get_param(){

                                    var param = new StringBuilder("{");
                                    param.append_printf(""""protocol": "%s",""", this.Protocol);
                                    param.append_printf(""""location": "%s",""", this.Location);
                                    param.append_printf(""""username": "%s",""", this.UserName);
                                    param.append_printf(""""password": "%s",""", this.Password);
                                    param.append_printf(""""domain": "%s",""", this.Domain);
                                    param.append_printf(""""anonymous": %s,""", this.Anonymous.to_string());
                                    param.append_printf(""""uri": "%s",""", this.location.get_uri());
                                    param.append_printf(""""timeout": %s}""", this.MOUNT_TIMEOUT_SEC.to_string());

                                    return param.str;
                                }

                                public  void json (Mount mount) {

                                    if(this.location.get_path ().has_prefix(mount.get_root ().get_path ())){
                                        var r = new StringBuilder("{");
                                        r.append_printf (""""can_eject": %s,""", mount.can_eject ().to_string ());
                                        r.append_printf (""""can_unmount": %s,""", mount.can_unmount ().to_string ());
                                        r.append_printf (""""icon": "%s",""", mount.get_icon ().to_string ());
                                        r.append_printf (""""name": "%s",""", mount.get_name ());
                                        r.append_printf (""""root": "%s",""", mount.get_root ().get_path ());
                                        r.append_printf (""""sort_key": "%s",""", mount.get_sort_key ());
                                        r.append_printf (""""uuid": "%s",""", mount.get_uuid ());
                                        r.append_printf (""""location": "%s",""", this.location.get_path ());
                                        r.append_printf (""""is_shadowed": %s,""", mount.is_shadowed ().to_string ());
                                        r.append_printf (""""default_location": "%s"}""", mount.get_default_location ().get_path ());

                                        stdout.printf("""{"mount": %s, "params": %s}""", r.str, this.get_param());

                                        this.MLoop.quit ();
                                    }

                                }

                            }


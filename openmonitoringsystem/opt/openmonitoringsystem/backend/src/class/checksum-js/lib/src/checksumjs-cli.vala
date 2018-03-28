public static int main (string[] args) {

	var cs = ChecksumType.MD5;
	var from = "string";
	var target = "";

	if(args.length > 3){

		var i = 0;
		foreach (var a in args) { 

			switch(i){
				case 1:

				switch(a.up()){
					case "MD5":
					cs = ChecksumType.MD5;
					break;
					case "SHA1":
					cs = ChecksumType.SHA1;
					break;
					case "SHA256":
					cs = ChecksumType.SHA256;
					break;
					case "SHA384":
					cs = ChecksumType.SHA384;
					break;
					case "SHA512":
					cs = ChecksumType.SHA512;
					break;
				}

				break;
				case 2:
				from = a;
				break;
				case 3:
				target = a;
				break;
			}

			i++;
		}


		Checksum checksum = new Checksum (cs);

		switch(from){
			case "file":
			

    var file = File.new_for_path (target);

			if(file.query_exists ()){
				FileStream stream = FileStream.open (target, "rb");
				uint8 fbuf[256];
				size_t size;


				while ((size = stream.read (fbuf)) > 0) {
					checksum.update (fbuf, size);
				}

				unowned string digest = checksum.get_string ();
				stdout.printf  ("""{"checksum": "%s", "params": %s}""", digest.up(), paramsjson(cs, from, target));

			}else{
				stdout.printf  ("""{"error": {"code": 2, "message": "%s"}, "params": %s}""", "File doesn't exist.", paramsjson(cs, from, target));
			}

			break;
			default:
			stdout.printf  ("""{"checksum": "%s", "params": %s}""", Checksum.compute_for_string(cs, target).up(), paramsjson(cs, from, target));
			break;
		}

		return 0;

	}else{
		stdout.printf  ("""{"error": {"code": 1, "message": "%s"}}""", "Params not found");
		return 1;
	}

}

public static string paramsjson(ChecksumType cs, string from, string target){
	var param = new StringBuilder("{");
	param.append_printf(""""ChecksumType": "%s",""", cs.to_string());
	param.append_printf(""""From": "%s",""", from);
	param.append_printf(""""Target": "%s"}""", target);
	return param.str;
}



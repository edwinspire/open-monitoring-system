//
//  MyClass.cs
//
//  Author:
//       Edwin De La Cruz <edwinspire@gmail.com>
//
//  Copyright (c) 2017 edwinspire
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
using System.Threading;
using System;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Security;
using System.Net.Sockets;

namespace OpenMonitoringSystem
{

	namespace Client{

		public struct ClientParam{
			public string Server;
			public int idequipment;
			public string validator;
		}

		public struct EventData {
			public string ID;
			public DateTime dateevent;
			public int ideventtype;
			public string description;
			public string source;
			public object detailsJSON;
		}

		public abstract class Comunicator{
			public string ConfigDir = Path.Combine(current_path(), "config");
			public ClientParam Client = new ClientParam();
			public abstract EventData getEvent();

			public Comunicator(string dir_json_config_path = ""){

				if(dir_json_config_path.Length > 0){
					this.ConfigDir = dir_json_config_path;	
				}else{
					Path.Combine(current_path(), "config");
				}

				this.Client.Server = "http://localhost";
				this.Client.idequipment = 0;
				this.Client.validator = "abcdefghijklmnopqrstuvwzyz";
				this.Client = this.getLocalObject <ClientParam>("OMSClient.json");
			}

			public string genIDEvent(EventData ev){
				ev.ID = "";

				return FormsAuthentication.HashPasswordForStoringInConfigFile(SerializeObject<EventData> (ev), "MD5");
			}

			public Comunicator(string server, int idequipment, string validator, string config_dir){

				this.Client.Server = server;
				this.Client.idequipment = idequipment;
				this.Client.validator = validator;
				this.ConfigDir = config_dir;

				this.Client = this.getLocalObject <ClientParam>("OMSClient.json");
			}

			public static string current_path(){
				return System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location);
			}

			public static string GetLocalIPAddress()
			{
				var host = Dns.GetHostEntry(Dns.GetHostName());
				foreach (var ip in host.AddressList)
				{
					if (ip.AddressFamily == AddressFamily.InterNetwork)
					{
						return ip.ToString();
					}
				}
				throw new Exception("Local IP Address Not Found!");
			}

			public static string Post(string uri, NameValueCollection pairs)
			{
				string response = "";
				try{
					using (WebClient client = new WebClient())
					{
						response = System.Text.Encoding.UTF8.GetString(client.UploadValues(uri, pairs));

					}
				}
				catch(Exception e){
					Console.WriteLine (e.Message);
				}

				return response;
			}

			public string SendEvent(System.Collections.Generic.List<EventData> ev)
			{
				var R = "";
				var server = this.Client.Server + "/service/events/receiver/w/" + ((int)DateTime.Now.Ticks).ToString () + "/" + ((int)DateTime.Now.Ticks).ToString () + "/"+ ((int)DateTime.Now.Ticks).ToString () + "/"+ev.Count.ToString();
				//var server = this.Client.Server + "/events/datas/w/" + ((int)DateTime.Now.Ticks).ToString () + "/" + ((int)DateTime.Now.Ticks).ToString () + "/" + ((int)DateTime.Now.Ticks).ToString ();
				Console.WriteLine (server);
				if(ev.Count > 0){
					R = Post(server, new NameValueCollection()
						{
							{ "idequipment", this.Client.idequipment.ToString() },
							{ "validator", this.Client.validator},
							{ "list_events", JsonConvert.SerializeObject(ev)}
						});
				}
				return R;
			}



			public T getRemoteObject<T>(string filename, string server = "") where T : new(){

				var R = new T();
				if (String.IsNullOrEmpty (server) || String.IsNullOrEmpty (filename)) {
					server = this.Client.Server + "/service/objects/view_equipment_config/r/" + ((int)DateTime.Now.Ticks).ToString () + "/" + ((int)DateTime.Now.Ticks).ToString () + "/"+ ((int)DateTime.Now.Ticks).ToString () + "/" + filename;
				}

				if(String.IsNullOrEmpty(filename)){
					Console.WriteLine ("No ha ingresado un nombre de archivo");
				}else{
					string r = Post(server, new NameValueCollection()
						{
							{ "idequipment", this.Client.idequipment.ToString() },
							{ "validator", this.Client.validator},
							{ "file_name", filename}
						});

					string pattern = @"\[\{\""object\"":(.*?)\}\]";

					Regex rex = new Regex(pattern);
					MatchCollection matches = rex.Matches(r);


					if (matches.Count > 0) {
						foreach (Match match in matches) {
							R = DeserializeObject<T> (match.Groups [1].Value);
						}
					}
						
				}
				return R;
			}

			public T getObjectRecursive<T>(string filename, bool force_remote = false, string server = "") where T : new(){

				if (force_remote) {
					var r = this.getRemoteObject<T> (filename, true, server);
					this.saveLocalObject (r, filename);
					return r;
				} else {

					if (!File.Exists (Path.Combine (this.ConfigDir, filename))) {
						var r = new T();
						this.saveLocalObject<T> (r, filename);
						return r;
					} else {
						return this.getLocalObject<T> (filename);
					}
						
				}

			}

			public T getRemoteObject<T>(string filename, bool and_save = true, string server = "") where T : new(){
				var r = this.getRemoteObject<T> (filename, server);
				this.saveLocalObject (r, filename);
				return r;
			}

			public T getLocalObject<T>(string filename) where T : new(){
				
				if(String.IsNullOrEmpty(this.ConfigDir)){
					this.ConfigDir = Path.Combine(current_path(), "config");
				}
					
				var full_path = Path.Combine(this.ConfigDir, filename);

				// This text is added only once to the file.
				if (!File.Exists(full_path))
				{
					System.IO.Directory.CreateDirectory (this.ConfigDir);
					this.saveLocalObject<T> (new T(), filename);
				}

				// Open the file to read from.
				string jsonobj = File.ReadAllText(full_path);
				return DeserializeObject<T>(jsonobj);
			}

			public void saveLocalObject<T>(T obj, string filename){

				if(String.IsNullOrEmpty(this.ConfigDir)){
					this.ConfigDir = Path.Combine(current_path(),"config");
				}

				var full_path = Path.Combine(this.ConfigDir,  filename);

				// This text is added only once to the file.
				if (!File.Exists (full_path)) {
					System.IO.Directory.CreateDirectory (ConfigDir);
				}
					
				File.WriteAllText (full_path, SerializeObject (obj));
			}

			public static string SerializeObject<T>(T obj){
				return JsonConvert.SerializeObject(obj);
			}
			public static T DeserializeObject<T>(string obj) where T : new(){
				return JsonConvert.DeserializeObject<T>(obj);
			}

		}

	


	}



}


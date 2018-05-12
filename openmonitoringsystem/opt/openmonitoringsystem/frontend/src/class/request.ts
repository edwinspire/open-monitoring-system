import  request  from '@dojo/core/request';

export interface Payload {



}

export default class Request  {

	send (payload: Payload){

		return new Promise((resolve, reject) => {
			alert('Request solicitado...');
			request.post('services/', {headers: {'Content-Type': 'application/json'},  method: 'POST', user: 'edwin', password: 'hhhhhh', body:	 JSON.stringify(payload)}).then((response) => {

				response.json().then((r)=>{
					resolve(r);
				});

			}, (err)=>{
				reject(err);
			});

		});

	}

	
}

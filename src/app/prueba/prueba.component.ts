// import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
// import Pusher from 'pusher-js';


// @Component({
//   selector: 'app-prueba',
//   standalone: true,
//   imports: [],
//   templateUrl: './prueba.component.html',
//   styleUrl: './prueba.component.css'
// })
// export class PruebaComponent {

//   appaer: boolean = false

//   constructor (private http: HttpClient) {
//     // Enable pusher logging - don't include this in production


//     Pusher.logToConsole = true;

//     var pusher = new Pusher('40515aff38d2b1e01abb', {
//       cluster: 'us2'
//     });

//     let self = this
//     var channel = pusher.subscribe('my-channel');
//     channel.bind('my-event', function(data:any) {
//       self.appaer = true
//       console.log("Prueba");
//     });
//   }

//   pong() {
//     this.http.post("https://1d45-2806-101e-d-a299-8cdf-231a-3509-a0a7.ngrok-free.app/api/websocket", undefined).subscribe({
//       next(value) {
//           console.log("mandado")
//       },
//     })
//   }

// }

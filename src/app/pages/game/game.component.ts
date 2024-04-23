import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { OnDestroy,Injectable } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import Pusher from 'pusher-js';
import { TokenService } from '../../token.service';
import { DataService } from '../../data.service';
import { scheduled, timeout } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule,
    MatSlideToggle, MatToolbarModule, MatButtonToggleModule, MatCardModule,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
@Injectable({
  providedIn: 'root'
})
export class GameComponent implements OnInit,OnDestroy {
win = -1
hit = -1
  usuario = ""
  id_usuario = ""
  id_partida = ""
  coordenada = ""
  channel: string = ""
  channel2: string = ""
  channel3: string = ""
  channel4: string = ""
  // enemyTiles: string[][] = Array(5).fill(Array(8).fill('/src/assets/emptytile.jpeg'));
  // playerTiles: string[][] = Array(5).fill(Array(3).fill('/src/assets/emptytile.jpeg'));
  enemyTiles: string[][] = Array.from({length: 5}, () => Array(8).fill('/src/assets/emptytile.jpeg'));
playerTiles: string[][] = Array.from({length: 5}, () => Array(3).fill('/src/assets/emptytile.jpeg'));
  appaer: boolean = false
self = this
  // pusher: any;
  // channel: any;

  constructor(private http: HttpClient,private cookieService: CookieService ,private servi: TokenService, protected router: Router,private route: ActivatedRoute ,private dataService: DataService) {
    if (this.dataService.getDato2() == 2){
      this.getShipCoordinates();
    }

    console.log("dato1: "+this.dataService.getDato1());
    console.log("dato2: "+this.dataService.getDato2());
    console.log("dato3: "+this.dataService.getDato3());

    this.id_usuario = this.dataService.getDato3();
    // this.getShipCoordinates();
    Pusher.logToConsole = true;
     var pusher = new Pusher('b5bcbb60477b643ab290', {
      cluster: 'us2',
    });

    let self = this;
    this.id_partida = this.dataService.getDato1();
    // this.id_partida = "68";
    this.channel = 'join' + this.id_partida;

    console.log("canaaaal:"+this.channel);
    var channel = pusher.subscribe(this.channel);
    channel.bind('my-event', function(data:any) {
      // self.appaer = true;
      // alert(JSON.stringify(data));

      console.log("funcionaaaaaaa");
      console.log(data);
      console.log(self.id_partida);
      // self.router.navigate(['/registro']);
      self.getShipCoordinates();
    });

    //para el turno del jugador
    this.channel2 = 'hit' + this.id_usuario;
console.log("canaaaal2:"+this.channel2);
    var channel = pusher.subscribe(this.channel2);
    channel.bind('my-event', function(data:any) {
      // self.appaer = true;

      alert(JSON.stringify("te dieron, es tu turno"));
      self.hit = 1
      timeout(1000)
      self.hit = -1
      self.usuario = "guest"

      console.log("funcionaaaaaaa22");
      console.log(data);
      console.log(self.id_partida);
      // self.router.navigate(['/registro']);
      // self.getShipCoordinates();
    });

    this.channel3 = 'nohit' + this.id_usuario;
    console.log("canaaaal3:"+this.channel3);
    var channel = pusher.subscribe(this.channel3);
    channel.bind('my-event', function(data:any) {
      // self.appaer = true;
      alert(JSON.stringify("no te dieron,es tu turno"));
      self.hit = 0
      timeout(1000)
      self.hit = -1

      self.usuario = "guest"

      console.log("funcionaaaaaaa22");
      console.log(data);
      console.log(self.id_partida);
      // self.router.navigate(['/registro']);
      // self.getShipCoordinates();
    });

    this.channel4 = 'win' + this.id_usuario;
    console.log("canaaaal3:"+this.channel4);
    var channel = pusher.subscribe(this.channel4);
    channel.bind('my-event', function(data:any) {
      // self.appaer = true;
      alert(JSON.stringify("has perdido "));
      // self.usuario = "guest"
      if (self.id_usuario == data.id_usuario){  self.win = 1}
      else{self.win = 0}
      console.log("funcionaaaaaaa22");
      console.log(data);
      console.log(self.id_partida);
      // self.router.navigate(['/registro']);
      // self.getShipCoordinates();
    });

  }


  getShipCoordinates() {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    this.http.get('http://192.168.116.105:8000/api/consultarCordenadas',{ headers: headers }).subscribe((data: any) => {
      // Process the data and update playerTiles
      console.log(data);
      console.log(data.data);
      console.log(data.data.coordinate);
      console.log(data.coordinate);
      this.usuario = data.posicion;
      this.id_usuario = data.id_usuario;
      console.log("useeeeeerrr"+this.usuario);
      // console.log(data.coordinates[0]);
      this.updatePlayerTiles(data.data);
    });
  }









  ngOnDestroy(): void {
    this.servi.sendRequestWithToken('api/partidaCancelada',{}).subscribe((data: any) => {
      console.log("esto es cuando se cancela"+data);
    })
    this.router.navigate(['/landing']);

  }
  a=""
  b=""
  dig=["A","B","C","D","E"]
  comp = []
  //metodo para manejar el clic en el boton
  handleClick(rowIndex: number, colIndex: number) {
console.log(this.usuario)
    //inicia el guest
    if (this.usuario == "guest") {
    this.a = this.dig[rowIndex]
    this.b = (colIndex+1).toString()
    console.log(this.a+this.b)
    this.coordenada = this.a+this.b
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    this.http.post("http://192.168.116.105:8000/api/movimiento", {"coordinate":this.coordenada},{ headers: headers } ).subscribe((data: any) => {
      console.log(data);
      // console.log(data.data);
      // console.log(data.data.coordinate);
      // console.log(data.coordinate);
      // this.usuario = data.data.posicion;
      // console.log(this.usuario);
      // this.updatePlayerTiles(data.data.coordinate);
    })
  }
  else {//enable los botones
    this.buttonStates[rowIndex][colIndex] = false;
  }

    //enviamos por medio de post la coordenada
  }





  updatePlayerTiles(data: Array<string>) {
//quiero recibir un array y que por cada coordenada que reciba, me cambia la primer letra a numero y despues
    for (let coord of data) {

      let row = this.getNumberFromLetter(coord[0]);
      let col = parseInt(coord.slice(1)) - 1;
      console.log(row, col);

      this.tiles[row-1][col] = 'assets/images/boat.jpeg';
    }
  }

  getIndexFromLetter(letter: string): number {
    return letter.charCodeAt(0) - 'A'.charCodeAt(0);
  }

  // SPRITES REFERENCES
  waterTiles: string[] = [
    'assets/images/oceantile.jpeg',
  ];

  // IDK if ill use this because the player doesnt see the enemy boats
  oponentBoatTiles: string = 'assets/barco(1).png';

  // Tiles stores the images and positions
  tiles: string[][] = [];
  oponentBoatPositions: boolean[][] = [];
  buttonStates: boolean[][] = [];

  ngOnInit() {

    this.id_partida = this.dataService.getDato1();
    // this.id_partida = "68";
    this.channel = 'join' + this.id_partida;
    // console.log("canaaaal:"+this.channel);
    // this.channel = 'join81';
    console.log("canaaaal:"+this.channel);
    console.log("este es el id de la partida2: "+this.id_partida);
    this.initializeOponentBoard();
    this.initializeButtonStates();
    // this.number = history.state.number;


  }

  initializeOponentBoard() {
    this.drawOponentBoard();
    // this.getOponnentBoatsPositions();
    //console.log(this.tiles);
  }

  // Maybe this one goes in the game component
  getOponnentBoatsPositions() {
  }

  drawOponentBoard() {
    for (let i = 0; i < 5; i++) {
      this.tiles[i] = [];

      for (let j = 0; j < 8; j++) {
        const randomIndex = Math.floor(Math.random() * this.waterTiles.length);
        this.tiles[i][j] = this.waterTiles[randomIndex];
      }
    }
  }


  // Coordinates guide
  getLetterFromIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }
   // Método para determinar si un botón debería estar deshabilitado
   initializeButtonStates() {
    for (let i = 0; i < this.tiles.length; i++) {
      this.buttonStates[i] = Array(this.tiles[i].length).fill(true);
    }
  }

  getNumberFromLetter(letter: string): number {
    return letter.charCodeAt(0) - 64;
  }

  }

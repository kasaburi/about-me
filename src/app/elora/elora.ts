import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-elora',
  imports: [CommonModule,RouterModule,TranslateModule],
  templateUrl: './elora.html',
  styleUrl: './elora.css',
})
export class Elora {



public elora: string = "assets/elo.svg";
public el: string = "assets/el.svg";
public re: string = "assets/re.svg";

public person: string = "assets/eloraperson.svg";
public person1: string = "assets/eloraperson1.svg";
public auth: string = "assets/auth.svg";
public registre: string = "assets/registre.svg";
public elorawiframe: string = "assets/wiframe.png";
public deswif: string = "assets/deswif.svg";

public desingel: string = "assets/desingel.svg";
public eldes: string = "assets/eldes.svg";
public mobelora: string = "assets/mobelora.svg";
public dashbord: string = "assets/dashbord.svg";


}

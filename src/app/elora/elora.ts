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



public elora: string = "assets/elo.webp";
public el: string = "assets/el.webp";
public re: string = "assets/re.webp";

public person: string = "assets/eloraperson.webp";
public person1: string = "assets/eloraperson1.webp";
public auth: string = "assets/auth.webp";
public registre: string = "assets/registre.webp";
public elorawiframe: string = "assets/wiframe.png";
public elorawiframeWebp: string = "assets/wiframe.webp";
public deswif: string = "assets/wiframe.png";

public desingel: string = "assets/desingel.webp";
public eldes: string = "assets/eldes.png";
public mobelora: string = "assets/mobelora.png";
public dashbord: string = "assets/dashbord.webp";


}

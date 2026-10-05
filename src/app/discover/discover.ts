import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-discover',
  imports: [CommonModule,RouterModule,TranslateModule],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
})
export class Discover {


public dis: string = "assets/dis.svg";
public logo: string = "assets/logo.svg";
public mob: string = "assets/mob.svg";
public flow: string = "assets/yvav.svg";
public reserch: string = "assets/reserch.svg";
public ux: string = "assets/ux.svg";
public ux1: string = "assets/ux1.svg";
public userflow: string = "assets/flow.svg";
public flow1: string = "assets/flow1.svg";
public wiframe: string = "assets/wiframe.png";
public comp: string = "assets/comp.svg";


public dis1: string = "assets/comp.svg";
public kax: string = "assets/comp1.svg";
public mobdes: string = "assets/mobile1.svg";
public mob1: string = "assets/mobile.svg";









}

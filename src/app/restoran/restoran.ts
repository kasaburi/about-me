import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-restoran',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './restoran.html',
  styleUrl: './restoran.css',
})
export class Restoran {
public ilus: string = "assets/ilus.png";
public after: string = "assets/after.svg";
public ser: string = "assets/ser.svg";

public person: string = "assets/resperson.svg";
public map: string ="assets/map.svg";
public last: string ="assets/last.svg";

}

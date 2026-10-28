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
public ilusWebp: string = "assets/ilus.webp";
public after: string = "assets/after.png";
public ser: string = "assets/ser.webp";

public person: string = "assets/resperson.webp";
public map: string ="assets/map.png";
public last: string ="assets/last.webp";

}

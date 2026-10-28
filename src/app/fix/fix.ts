import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-fix',
  imports: [CommonModule,RouterModule,TranslateModule],
  templateUrl: './fix.html',
  styleUrl: './fix.css',
})
export class Fix {


public fix: string = "assets/fix.webp";
public stat: string = "assets/stat.webp";

public ilu: string = "assets/ilu.webp";
public iluWebp: string = "assets/ilu1.webp";
public ilu1: string = "assets/ilu1.webp";
public ilu1Webp: string = "assets/ilu1.webp";
public table: string = "assets/table.png";
public fixper: string = "assets/fixper.webp";
public fixwi: string = "assets/fixwi.png";
public fixwiWebp: string = "assets/fixwi.webp";

public fixcomp: string = "assets/fixcomp.webp";
public fixcomp1: string = "assets/fixcomp1.webp";
}

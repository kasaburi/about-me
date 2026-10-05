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


public fix: string = "assets/fix.svg";
public stat: string = "assets/stat.svg";

public ilu: string = "assets/ilu.png";
public ilu1: string = "assets/ilu1.png";
public table: string = "assets/table.svg";
public fixper: string = "assets/fixper.svg";
public fixwi: string = "assets/fixwi.png";

public fixcomp: string = "assets/fixcomp.svg";
public fixcomp1: string = "assets/fixcomp1.svg";
}

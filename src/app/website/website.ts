import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-website',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './website.html',
  styleUrl: './website.css',
})
export class Website {
  public desing: string = 'assets/desing.png';
  public desingWebp: string = 'assets/desing.webp';
}

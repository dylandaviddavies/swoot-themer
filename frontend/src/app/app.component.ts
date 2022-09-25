import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  form: FormGroup;

  set colors(colors: string[]) {
    this._colors = colors;

    const style = getComputedStyle(document.body);

    const fg = this.form.controls['colors'] as FormGroup;

    for (const color of colors) {
      const value = style.getPropertyValue('--swoot-' + color);

      fg.setControl(color, this.fb.control(value), { emitEvent: false });
    }
  }

  get colors() {
    return this._colors;
  }

  private _colors: string[] = [];

  constructor(private httpClient: HttpClient, private fb: FormBuilder) {
    this.form = fb.group({
      colors: fb.group({}),
    });
  }

  ngOnInit() {
    this.form.valueChanges.subscribe((form) => {
      this.loadCss(form.colors).subscribe();
    });

    this.loadCss().subscribe(() => {
      this.loadColors().subscribe();
    });
  }

  loadColors() {
    return this.httpClient.get<string[]>('http://localhost:3000/colors').pipe(
      tap((colors) => {
        this.colors = colors;
      })
    );
  }

  loadCss(colors: Record<string, string> = {}) {
    return this.httpClient
      .post('http://localhost:3000/css', { colors }, { responseType: 'text' })
      .pipe(
        tap((css) => {
          document
            .getElementById('customCss')!
            .appendChild(document.createTextNode(css));
        })
      );
  }
}

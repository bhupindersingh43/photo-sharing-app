import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let appComponent: AppComponent;
  beforeEach(async () => {
    appComponent = new AppComponent();
  });

  it(`should have as title 'client'`, () => {
    expect(appComponent.title).toEqual('client');
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain('client app is running!');
  // });
});

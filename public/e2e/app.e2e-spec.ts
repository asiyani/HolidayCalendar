import { HolidayCalendarPage } from './app.po';

describe('holiday-calendar App', function() {
  let page: HolidayCalendarPage;

  beforeEach(() => {
    page = new HolidayCalendarPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

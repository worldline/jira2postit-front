import { browser, by, element } from 'protractor'

export class AppPage {
  navigateTo(): Promise<void> {
    return browser.get('/')
  }

  getParagraphText(): string {
    return element(by.css('app-root h1')).getText()
  }
}

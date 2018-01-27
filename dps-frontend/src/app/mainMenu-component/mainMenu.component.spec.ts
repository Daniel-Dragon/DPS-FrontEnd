import { MainMenuComponent } from './mainMenu.component';

describe('MainMenuComponent', () => {
    let cmp: MainMenuComponent;
    beforeEach(() => {
        cmp = new MainMenuComponent();
    });

    it('should be defined', () => {
        expect(cmp).toBeDefined();
    });
});
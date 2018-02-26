import { MainMenuComponent } from './mainMenu.component';
import { BsModalService } from '../shared-module/index';

describe('MainMenuComponent', () => {
    let cmp: MainMenuComponent;
    let mockModalService;
    beforeEach(() => {
        mockModalService = {
            makeModal: jasmine.createSpy(),
            dismissModal: jasmine.createSpy()
        };
        cmp = new MainMenuComponent(mockModalService);
    });

    it('should be defined', () => {
        expect(cmp).toBeDefined();
    });
});

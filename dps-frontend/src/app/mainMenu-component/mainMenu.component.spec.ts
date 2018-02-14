import { MainMenuComponent } from './mainMenu.component';
import { ModalService } from '../shared-module/modal.service/modal.service';

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

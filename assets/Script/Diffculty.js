cc.Class({
    extends: cc.Component,

    properties: {
        panel: {
            type: cc.Layout,
            default: null
        },
        mask: {
            type: cc.Layout,
            default: null
        }
    },

    onLoad() {
        this.panel.node.y = -640;
        this.mask.node.active = false;

        globalEvent.on('NEW', this.onShow, this);
        globalEvent.on('CANCEL', this.onHide, this);
        globalEvent.on('NEW_GAME_DIFF', this.onHide, this);
        globalEvent.on('GAME_FINISH', this.onGameFinish, this);
    },

    onDestroy() {
        globalEvent.off('NEW', this.onShow, this);
        globalEvent.off('CANCEL', this.onHide, this);
        globalEvent.off('NEW_GAME_DIFF', this.onHide, this);
        globalEvent.on('GAME_FINISH', this.onGameFinish, this);
    },

    start() { },

    onShow() {
        this.mask.node.active = true;
        let action = cc.moveTo(0.1, cc.p(0, 0));
        this.panel.node.runAction(action);
    },

    onHide() {
        this.panel.node.getChildByName('ButtonCancel').active = true;
        this.mask.node.active = false;
        let action = cc.moveTo(0.1, cc.p(0, -640));
        this.panel.node.runAction(action);
    },

    onGameFinish() {
        this.panel.node.getChildByName('ButtonCancel').active = false;
    }
});

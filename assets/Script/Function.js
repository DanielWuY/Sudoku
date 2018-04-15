cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() { },

    onClickUndo(event, customEventData) {
        globalEvent.emit('UNDO');
    },

    onClickErase(event, customEventData) {

    }
});

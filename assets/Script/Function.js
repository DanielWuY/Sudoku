cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() { },

    onClickUndo(event, customEventData) {
        globalEvent.emit('UNDO');
    },

    onClickErase(event, customEventData) {
        globalEvent.emit('ERASE');
    },

    onClickMark() {
        globalEvent.emit('MARK');
    },

    onClickHint() {
        globalEvent.emit('HINT');
    },

    onClickNew() {
        globalEvent.emit('NEW');
    },

    onClickCancel() {
        globalEvent.emit('CANCEL');
    },

    onClickNewGameByDiff(event, customEventData) {
        globalEvent.emit('NEW_GAME_DIFF', customEventData);
    },

    onClickPause() {
        globalEvent.emit('GAME_PAUSE');
    },

    onClickResume() {
        globalEvent.emit('GAME_RESUME');
    }
});

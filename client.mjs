import alt from "alt";
import game from "natives";

function loadModel(model) {
    return new Promise(
        (resolve, reject) => {
            let _model = game.getHashKey(model);

            if(game.isModelInCdimage(_model) && game.isModelValid(_model)) {
                game.requestModel(_model);
    
                let after = () => {resolve(_model)};
                let check = () => {
                    if(game.hasModelLoaded(_model))
                        after();
                    
                    else setTimeout(
                        check,
                        10
                    )
                };

                check();
            }
    
            else reject("altmp-js-prop-spawner loadModel was triggered with invalid model!");
        }
    )
}


export default class Prop {

    constructor(model, pos, dynamic) {
        this.id = null;

        loadModel(model)
        .then(
            (_model) => {
                this.id = game.createObjectNoOffset(
                    _model, 
                    pos.x, pos.y, pos.z, 
                    false, true, dynamic
                );

                game.setModelAsNoLongerNeeded(_model);

                if (!dynamic)
                    game.freezeEntityPosition(this.id, true);
            }
        )
    }

    destroy() {
        if(this.id !== null) {
            if(game.doesEntityExist(this.id))
                game.deleteEntity(this.id);
    
            this.id = null;
        }
    }
}
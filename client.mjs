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

let PROPS_LIST = [];
export default {
    /**
     * @param model - STRING model;
     * @param pos - OBJECT {x, y, z} pos;
     * @param options - OBJECT {dynamic} options;
     */
    new: (model, {x, y, z}, {dynamic}) => {
        let id = PROPS_LIST.length;
        PROPS_LIST.forEach(
            (prop, index) => {
                if(prop === undefined) id = index;
            }
        );
        PROPS_LIST[id] = {};

        loadModel(model)
        .then( //new fnc.
            (modelHash) => {
                let prop = PROPS_LIST[id];
                if(prop === undefined) throw "altmp-js-prop-spawner prop was deleted, before creation finished!";

                prop.instance = game.createObjectNoOffset(
                    modelHash, 
                    x, y, z, 
                    false, true, dynamic
                );

                game.setModelAsNoLongerNeeded(modelHash);

                 if (!dynamic)
                    game.freezeEntityPosition(prop.instance, true);

                return prop;
            }
        ).then( //Destroy func.
            (prop) => {
                prop.destroy = () => {
                    if(prop !== undefined) {
                        if(game.doesEntityExist(prop.instance))
                            game.deleteEntity(prop.instance);
                
                        prop.instance = null;
                    }

                    PROPS_LIST[id] = undefined;
                };
            }
        ).catch(
            (e) => {
                alt.warn(e);
            }
        );

        return {
            id: id,
            destroy: () => {
                PROPS_LIST[id].destroy();
            }
        };
    }
};
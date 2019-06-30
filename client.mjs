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

let findUnusedPropID = () => {
    for(let i = 0; i < PROPS_LIST.length; i++)
        if(PROPS_LIST[i] === undefined) return i;

    return PROPS_LIST.length;
};

export default {
    /**
     * @param model - STRING model;
     * @param pos - OBJECT {x, y, z} pos;
     * @param options - OBJECT {dynamic} options;
     */
    new: (model, {x, y, z}, {dynamic}) => {
        let id = findUnusedPropID();
        PROPS_LIST[id] = {
            destroy: () => {},
            getPosition: () => { return {x: x, y: y, z: z}; }
        };

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

                if (!dynamic) {
                    game.freezeEntityPosition(prop.instance, true);
                    
                    prop.savedPos = {
                        x: x,
                        y: y,
                        z: z
                    };
                }

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

                prop.getPosition = () => {
                    if(prop.savedPos != undefined)
                        return prop.savedPos;

                    return game.getEntityCoords(
                        prop.instance,
                        false
                    );
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
                PROPS_LIST[this.id].destroy();
            },
            get position() {
                return PROPS_LIST[this.id].getPosition();
            },
        };
    }
};
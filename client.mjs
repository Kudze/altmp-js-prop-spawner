import alt from "alt";
import game from "natives";

/*
  C++ code extracted from some old dead mp.

    if (STREAMING::IS_MODEL_IN_CDIMAGE(newObject.model) && STREAMING::IS_MODEL_VALID(newObject.model))
	{
		STREAMING::REQUEST_MODEL(newObject.model);
		while (!STREAMING::HAS_MODEL_LOADED(newObject.model))
			WAIT(0);
		newObject.objectObject = OBJECT::CREATE_OBJECT_NO_OFFSET(newObject.model, x, y, z, false, true, dynamic);
		STREAMING::SET_MODEL_AS_NO_LONGER_NEEDED(newObject.model);

		ENTITY::SET_ENTITY_ROTATION(newObject.objectObject, pitch, roll, heading, 2, 1);

		if (!dynamic)
			ENTITY::FREEZE_ENTITY_POSITION(newObject.objectObject, true);
		
		newObject.used = true;
		objectData.push_back(newObject);
		LOG(TRACE) << "Created Object " << objectid;
		return 1;
	}
 */

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

export function createProp(model, pos, dynamic, callback) {
    loadModel(model)
        .then(
            (_model) => {
                let id = game.createObjectNoOffset(
                    _model, 
                    pos.x, pos.y, pos.z, 
                    false, true, dynamic
                );

                game.setModelAsNoLongerNeeded(_model);

                if (!dynamic)
                    game.freezeEntityPosition(id, true);

                    alt.log(`CreatePROP ${id}`);
                callback(id);
            }
        )
}

export function destroyProp(id) {
    alt.log(`DestroyPROP ${id}`);

    if(id !== null) {
        if(game.doesEntityExist(id))
            game.deleteEntity(id);

        id = null;
    }
}
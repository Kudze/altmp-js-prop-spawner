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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function loadModel(model) {
    return new Promise(
        (resolve, reject) => {
            let _model = game.getHashKey(model);

            if(game.isModelInCdimage(_model) && game.isModelValid(_model)) {
                game.requestModel(_model);
    
                while(!game.hasModelLoaded(_model))
                    await sleep(1);
            
                resolve(_model)
            }
    
            else reject("altmp-js-prop-spawner loadModel was triggered with invalid model!");
        }
    )
}

class Prop {
    id = null;

    constructor(model, pos, dynamic) {
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
        ).catch(
            (e) => {
                alt.warn(e);
            }
        );
    }

    destroy = () => {
        if(this.id !== null) {
            if(game.doesEntityExist(this.id))
                game.deleteEntity(this.id);

            this.id = null;
        }
    }
}

export default Prop;

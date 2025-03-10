import {BaseRepository} from "../../repositories/baseRepository.js";
import {crudSample} from "../../entities/sample/crudSample.js";

class crudSampleModel extends BaseRepository {
    constructor() {
        super(crudSample);
    }
}



// ✅ Export as a singleton instance
export const crudModel = new crudSampleModel();

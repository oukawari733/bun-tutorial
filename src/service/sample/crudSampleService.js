import {crudServiceImpl} from "../../serviceImpl/sample/crudSampleServiceImpl.js";

export const crudService = {
    save: (data) => crudServiceImpl.save(data),
    update: (id, data) => crudServiceImpl.save(id, data),
    delete: (id) => crudServiceImpl.save(id),
   };


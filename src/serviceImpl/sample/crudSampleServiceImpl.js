import {crudModel} from "../../model/sample/crudSampleModel.js";
import {crudSampleDTO} from "../../dto/sample/crudSampleDTO.js";
import {Value} from "@sinclair/typebox/value";
import {copyNonNullProperties} from "../../utils/commonHelper.js";

export class crudSampleServiceImpl {

    async save(data) {
        // Validate input using TypeBox
        if (!Value.Check(crudSampleDTO, data)) {
            return { error: "Data Invalid" };
        }

        const exist = await crudModel.findById(data.id);
        if (exist) {
            return { error: "Data sudah ada" };
        }

        return await crudModel.save(data);
    }

    async update(id, data) {
        // Validate input structure using TypeBox
        if (!Value.Check(crudSampleDTO, data)) {
            return { error: "Data Invalid" };
        }

        // Find existing record
        const exist = await crudModel.findById(id);
        if (!exist) {
            return { error: `Data tidak ditemukan dengan ID: ${id}` };
        }

        // Merge non-null properties from new data into existing object
        const updatedData = copyNonNullProperties(exist, data);

        // Save updated record
        return await crudModel.save(updatedData);
    }

    async delete(id) {
        // Check if the data exists
        const exist = await crudModel.findById(id);
        if (!exist) {
            return { error: `Data tidak ditemukan dengan ID: ${id}` };
        }

        // Delete user by username
        return await crudModel.delete(id);
    }

}

export const crudServiceImpl = new crudSampleServiceImpl();

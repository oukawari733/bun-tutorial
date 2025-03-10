import {t} from "elysia";
import {crudService} from "../../service/sample/crudSampleService.js";
import {crudSampleDTO} from "../../dto/sample/crudSampleDTO.js";


export const save = async ({ body, set }) => {
    const response = await crudService.save(body); // <-- No `.data`
    if (response.error) {
        set.status = 400;
        return response;
    }
    return response;
};

export const update = async ({ params, body, set }) => {
    const { id } = params;
    const response = await crudService.update(id, body);
    if (response.error) {
        set.status = 400;
        return response;
    }

    return response;
};

export const deleteData = async ({ params, set }) => {
    const { id } = params;

    if (!id) {
        set.status = 400;
        return { error: "Id is required" };
    }

    return crudService.delete(id);
};

// Register authentication routes
export const crudRoutes = (app) =>
    app.post(
        "/sample/save",
        save,
        {
            body:  crudSampleDTO,
            detail: {
                tags: ["Sample"], // 👈 Group under "sample"
                summary: "Save Data",
                description: "Simpan data"
            }
        }
    ).put(
        "/sample/update/:id",
        update,
        {
            body: crudSampleDTO,
            params: t.Object({ id: t.Integer() }), // Expecting username in URL
            detail: {
                tags: ["Sample"],
                summary: "Update Data",
                description: "Update Data yang sudah ada",
            }
        }
    ).delete(
        "/sample/update/:id",
        deleteData,
        {
            params: t.Object({ id: t.Integer() }), // Expecting username in URL
            detail: {
                tags: ["Sample"],
                summary: "Delete",
                description: "Delete Data",
            }
        }
    )
;

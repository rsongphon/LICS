import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { ExperimentPublic } from '../types.gen';

export class CustomExperimentsService {
    /**
     * Compile Experiment
     * Compile an experiment to Python code.
     * @param data The data for the request.
     * @param data.id
     * @returns ExperimentPublic Successful Response
     * @throws ApiError
     */
    public static compileExperiment(data: { id: string }): CancelablePromise<ExperimentPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/experiments/{id}/compile',
            path: {
                id: data.id
            },
            errors: {
                422: 'Validation Error'
            }
        });
    }
}

import * as uuid from 'uuid';


export function getNewId(): string {
    return String(uuid.v1())
}


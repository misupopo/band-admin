import { Injectable } from '@angular/core';
import * as changeCase from 'change-case';

@Injectable()
export class CamelcaseConverter {
    public convertForCamelcase(value: string) {
        return changeCase.camelCase(value);
    }

    public convertForSnakeCase(value: string) {
        return changeCase.snakeCase(value);
    }
}

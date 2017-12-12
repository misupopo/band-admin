import { Injectable } from '@angular/core';
import camelcase from 'camel-case';
import snakeCase from 'snake-case';

@Injectable()
export class CamelcaseConverter {

    public convertForCamelcase(value: string) {
        return camelcase(value);
    }

    public convertForSnakeCase(value: string) {
        return snakeCase(value);
    }
}

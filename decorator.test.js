"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
// class decorator
function record() {
    console.log('record decorator called');
    return function (constructor) {
        console.log('initilized1');
    };
}
const countryMetaKey = Symbol('country');
function nationality(country) {
    return function (target) {
        console.log('target', target);
        Reflect.defineMetadata(countryMetaKey, country, target.prototype);
    };
}
function withNationaity(target, property, descriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args) {
        const country = Reflect.getMetadata(countryMetaKey, target);
        const result = (original === null || original === void 0 ? void 0 : original.apply(this, args)) || {};
        return Object.assign(result, { country });
    };
}
let User = class User {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    get name() {
        return `${this.lastName} ${this.firstName}`;
    }
    getDetail() {
        return {
            name: this.name
        };
    }
};
__decorate([
    withNationaity,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "getDetail", null);
User = __decorate([
    nationality('CHINA'),
    __metadata("design:paramtypes", [String, String])
], User);
const user = new User('lee', 'bruse');
console.log('name ', user.name);
console.log('detail ', user.getDetail());
// reflect metadata get value in prototype chain
class Student extends User {
    constructor() {
        super(...arguments);
        this.job = 'student';
    }
}
const student = new Student('li', 'hong');
console.log(Reflect.getMetadata(countryMetaKey, student));
// reflect metadata get value in proxy
const studentProxy = new Proxy(student, {});
console.log('proxy', studentProxy.name);
console.log(Reflect.getMetadata(countryMetaKey, studentProxy));
console.log(studentProxy instanceof Student);
// Reflect.contruct
const stu2 = Reflect.construct(Student, ['zhang', 'san']);
console.log('stu2', stu2);
//# sourceMappingURL=decorator.test.js.map
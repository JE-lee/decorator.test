import 'reflect-metadata'

// class decorator
function record() {
  console.log('record decorator called')
  return function(constructor: any) {
    console.log('initilized1')
  }
}

const countryMetaKey = Symbol('country')

function nationality(country: string) {
  return function(target: any) {
    console.log('target', target)
    Reflect.defineMetadata(countryMetaKey, country, target.prototype)
  }
}

function withNationaity(target: any, property: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function (...args: any[]) {
    const country = Reflect.getMetadata(countryMetaKey, target)
    const result = original?.apply(this, args) || {}
    return Object.assign(result, { country })
  }
}

@nationality('CHINA')
class User{
  firstName: string
  lastName: string
  constructor(firstName: string, lastName: string) {
    this.firstName = firstName
    this.lastName = lastName
  }


  get name() {
    return `${this.lastName} ${this.firstName}`
  }

  @withNationaity
  getDetail() {
    return {
      name: this.name
    }
  }
}

const user = new User('lee', 'bruse')
console.log('name ',user.name)
console.log('detail ', user.getDetail())

// reflect metadata get value in prototype chain
class Student extends User {
  job = 'student'
}

const student = new Student('li', 'hong')
console.log(Reflect.getMetadata(countryMetaKey, student))

// reflect metadata get value in proxy
const studentProxy = new Proxy(student, {})
console.log('proxy', studentProxy.name)
console.log(Reflect.getMetadata(countryMetaKey, studentProxy))
console.log(studentProxy instanceof Student)

// Reflect.contruct
const stu2 = Reflect.construct(Student, ['zhang', 'san'])
console.log('stu2', stu2)

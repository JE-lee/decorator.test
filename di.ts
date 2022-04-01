import "reflect-metadata"

class Repository {
  private deps = new Map<any, any>()
  bind(target: any, args: any[]) {
    if (!this.deps.has(target)) {
      this.deps.set(target, args)
    }
  }
  has(target: any) {
    return this.deps.has(target)
  }
  get(target: any) {
    if (this.has(target)) {
      const paramtypes = this.deps.get(target)
      const args = paramtypes.map((paramtype: any) => this.get(paramtype))
      return Reflect.construct(target, args)
    }
    return null
  }
}

const repository = new Repository()

function Injectable(target: any) {
  const paramtypes = Reflect.getMetadata('design:paramtypes', target)
  // 注册依赖
  repository.bind(target, paramtypes || [])
}

@Injectable
class UserService {
  make() {
    return {
      firstName: 'lee',
      lastName: 'bruse'
    }
  }
}

class Controller {
  type =  'controller'
}

@Injectable
class UserController extends Controller{
  constructor(private userService: UserService) {
    super()
  }
  create() {
    return this.userService.make()
  }
}

const uc = repository.get(UserController)
console.log(uc instanceof Controller)
console.log(uc instanceof UserController)
console.log('new user', uc.create())
console.log('type', uc.type)

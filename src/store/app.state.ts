import { observable, computed, autorun, action } from 'mobx';

export default class Store {
  @observable name:string
  @observable age:number
  @observable count:number
  constructor (AppState: Store) {
    autorun(() => console.log(this.report));
    this.initialState(AppState);
  }

  @computed get report(): string {
    return `name: ${this.name}; age: ${this.age} and count: ${this.count}`
  }

  @action add () {
    this.count++;
  }

  @action changeAge (age: number) {
    this.age = age;
  }

  @action changeName (name: string = 'test server render') {
    this.name = name
  }

  // ssr的server用于获取当前数据的方法
  toJson () {
    return {
      name: this.name,
      count: this.count,
      age: this.age
    }
  }
  // ssr的client用于将服务器端数据合并到客户端数据的方法
  initialState ({ name = 'yifan', age = 20, count = 10 }: { name: string, age: number, count: number}) {
    this.name = name;
    this.age = age;
    this.count = count;
  }
}



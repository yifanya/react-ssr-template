declare namespace IndexMLessModule {
  export interface IIndexMLess {
    'h': string;
  }
}

declare const IndexMLessModule: IndexMLessModule.IIndexMLess & {
  locals: IndexMLessModule.IIndexMLess;
};

export = IndexMLessModule;
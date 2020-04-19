declare namespace IndexMLessModule {
  export interface IIndexMLess {
    'header': string;
  }
}

declare const IndexMLessModule: IndexMLessModule.IIndexMLess & {
  locals: IndexMLessModule.IIndexMLess;
};

export = IndexMLessModule;
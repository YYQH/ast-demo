import { generateHookCode } from '../src';
import generate from '@babel/generator';

describe('AST challenge test', () => {
  it('should generate the hook correctly', () => {
    const hookConfig = {
      queryInterface: 'UsePoolsQuery',
      hookName: 'usePools',
      requestType: 'QueryPoolsRequest',
      responseType: 'QueryPoolsResponse',
      queryServiceMethodName: 'pools',
      queryKey: 'poolsQuery'
    }
    const ast = generateHookCode(hookConfig);
    const { code } = generate(ast);
    console.log(111, code);
  })

  const showResult = json => {
    Object.entries(json).forEach(([methodName, types ]) => {
      const hookConfig = {
        queryInterface: `Use${methodName}Query`,
        hookName: `use${methodName}`,
        requestType: types.requestType,
        responseType: types.responseType,
        queryServiceMethodName: (methodName as string).toLowerCase(),
        queryKey: `${(methodName as string).toLowerCase()}Query`
      }
      const ast = generateHookCode(hookConfig);
      const { code } = generate(ast);
      console.log(111, code);
      
      expect(code).toMatchSnapshot();
    })
  }
  
  it('Take the input and output below, and make a function that can generate this code using babel AST:', () => {
    const json = {
      "Pools": {
          "requestType": "QueryPoolsRequest",
          "responseType": "QueryPoolsResponse"
      }
    };
    showResult(json)
  })
  it('test example-methods.json', () => {
    const exampleJson = require('../example-methods.json');
    // console.log(exampleData);
    showResult(exampleJson)
  })
})
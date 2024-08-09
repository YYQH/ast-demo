import * as t from '@babel/types';

// export interface UsePoolsQuery<TData> extends ReactQueryParams<QueryPoolsResponse, TData> {
//   request?: QueryPoolsRequest;
// }
const createInterfaceDeclaration = ({
  queryInterface = 'UsePoolsQuery',
  requestType = 'QueryPoolsRequest',
  responseType = 'QueryPoolsResponse',
}) => {
  // interface UsePoolsQuery
  const interfaceName = t.identifier(queryInterface);
  // <TData>
  const typeParameters = t.tsTypeParameterDeclaration([
    t.tsTypeParameter(null, null, 'TData')
  ]);
  // <QueryPoolsResponse, TData>
  const reactQueryParamsType = t.tsTypeParameterInstantiation([
    t.tsTypeReference(
      t.identifier(responseType)
    ),
    t.tsTypeReference(
      t.identifier('TData')
    )
  ])
  // extends ReactQueryParams
  const interfaceExtends = t.tsExpressionWithTypeArguments(
    t.identifier('ReactQueryParams'),
    reactQueryParamsType
  )
  // request?: QueryPoolsRequest;
  const interfaceBody = t.tsInterfaceBody([
    t.tsPropertySignature(
      t.identifier('request'),
      t.tsTypeAnnotation(
        t.tsTypeReference(
          t.identifier(requestType)
        )
      )
    ),

  ])
  return t.exportNamedDeclaration(
    t.tsInterfaceDeclaration(
      interfaceName,
      typeParameters,
      [interfaceExtends],
      interfaceBody
    )
  )
}

// const usePools = <TData = QueryPoolsResponse,>({
//   request,
//   options
// }: UsePoolsQuery<TData>) => {
//   return useQuery<QueryPoolsResponse, Error, TData>(["poolsQuery", request], () => {
//       if (!queryService) throw new Error("Query Service not initialized");
//       return queryService.pools(request);
//   }, options);
// };
const createFunctionDeclaration = ({
  queryInterface = 'UsePoolsQuery',
  hookName = 'usePools',
  requestType = 'QueryPoolsRequest',
  responseType = 'QueryPoolsResponse',
  queryServiceMethodName = 'pools',
  queryKey = 'poolsQuery'
}) => {
  // ({ request, options })
  const arrowFunctionParams = t.objectPattern(
    [
      t.objectProperty(
        t.identifier('request'),
        t.identifier('request')
      ),
      t.objectProperty(
        t.identifier('options'),
        t.identifier('options'),
      )
    ]
  )
  // ({ ... }): UsePoolsQuery<TData>
  arrowFunctionParams.typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier(queryInterface),
      t.tsTypeParameterInstantiation([
        t.tsTypeReference(
          t.identifier('TData')
        )
      ])
    )
  )
  const returnCallArrowFunction = t.callExpression(
    // useQuery
    t.identifier('useQuery'),
    [
      // ["poolsQuery", request]
      t.arrayExpression([
        t.stringLiteral(queryKey),
        t.identifier('request')
      ]),
      // () => {}
      t.arrowFunctionExpression(
        [],
        t.blockStatement([
          // if (!queryService) throw new Error("Query Service not initialized");
          t.ifStatement(
            t.unaryExpression(
              '!',
              t.identifier('queryService')
            ),
            t.throwStatement(
              t.newExpression(
                t.identifier('Error'),
                [
                  t.stringLiteral('Query Service not initialized')
                ]
              )
            )
          ),
          // return queryService.pools(request);
          t.returnStatement(
            t.callExpression(
              t.memberExpression(
                t.identifier('queryService'),
                t.identifier(queryServiceMethodName)
              ),
              [
                t.identifier('request')
              ]
            )
          )
        ])
      ),
      // options
      t.identifier('options')
    ],
  )
  // <QueryPoolsResponse, Error, TData>
  returnCallArrowFunction.typeParameters = t.tsTypeParameterInstantiation(
    [
      t.tsTypeReference(
        t.identifier(responseType)
      ),
      t.tsTypeReference(
        t.identifier('Error')
      ),
      t.tsTypeReference(
        t.identifier('TData')
      )
    ]
  )
  // arrow function body
  const arrowFunctionBody = t.blockStatement(
    // arrow function body
    [
      // return
      t.returnStatement(
        returnCallArrowFunction,
      )
    ]
  )
  // arrow function
  const arrayFunction = t.arrowFunctionExpression(
    [
      arrowFunctionParams
    ],
    arrowFunctionBody
  )
  // <TData = QueryPoolsResponse,>
  arrayFunction.typeParameters = t.tsTypeParameterDeclaration([
    t.tsTypeParameter(
      null,
      t.tsTypeReference(
        t.identifier(responseType)
      ),
      'TData'
    )
  ])
  // const usePools 
  const variableName = t.variableDeclarator(
    t.identifier(hookName),
    arrayFunction
  )
  return t.variableDeclaration('const', [variableName])
}

export function generateHookCode(config) {


  return t.file(
    t.program([
      createInterfaceDeclaration(config),
      createFunctionDeclaration(config)
    ])
  )
}
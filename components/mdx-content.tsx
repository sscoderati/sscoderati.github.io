import { useMDXComponents as getMDXComponents } from '@/mdx-components'
import type { ComponentType } from 'react'
import * as runtime from 'react/jsx-runtime'

const sharedComponents = getMDXComponents({})

const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

type MDXComponentsMap = Record<string, ComponentType>

type MDXContentProps = {
  code: string
  components?: MDXComponentsMap
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} />
}

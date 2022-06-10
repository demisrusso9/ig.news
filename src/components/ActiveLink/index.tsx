import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, cloneElement } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement
  active: string
}

export function ActiveLink({ children, active, ...props }: ActiveLinkProps) {
  const { asPath } = useRouter()

  const className = asPath === props.href ? active : ''

  return <Link {...props}>{cloneElement(children, { className })}</Link>
}

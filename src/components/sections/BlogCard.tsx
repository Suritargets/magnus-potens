import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/db/schema'

interface Props {
  post: BlogPost
  locale: string
  readMoreLabel?: string
  publishedLabel?: string
}

export function BlogCard({ post, locale, readMoreLabel = 'Read article', publishedLabel = 'Published' }: Props) {
  const href = `/${locale}/blog/${post.slug}`
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(post.publishedAt))
    : null

  return (
    <article
      style={{
        background: '#15171C',
        border: '1px solid rgba(199,158,107,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {post.coverImage && (
        <Link href={href} style={{ display: 'block', overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
      )}
      <div style={{ padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {date && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C79E6B', margin: '0 0 12px' }}>
            {publishedLabel} {date}
          </p>
        )}
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, color: '#E9E3D6', margin: '0 0 12px', lineHeight: 1.25 }}>
          <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, lineHeight: 1.75, color: '#8C877F', margin: '0 0 24px', flex: 1 }}>
            {post.excerpt}
          </p>
        )}
        <Link
          href={href}
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#C79E6B',
            textDecoration: 'none',
            alignSelf: 'flex-start',
          }}
        >
          {readMoreLabel} →
        </Link>
      </div>
    </article>
  )
}

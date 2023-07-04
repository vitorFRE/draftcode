import Link from 'next/link'
import { Badge } from '@components/ui/badge'

interface ChallengeCardProps {
	id: string
	image: string
	difficulty: string
	title: string
	brief: string
	technologies: string[]
}

export const ChallengesCard: React.FC<ChallengeCardProps> = ({
	id,
	image,
	title,
	difficulty,
	brief,
	technologies
}) => {
	return (
		<Link passHref href={`/desafios/${id}`} className='w-full max-w-sm'>
			<article className='rounded-md border border-border bg-secondary'>
				<figure className='h-[180px]'>
					<img src={image} alt={title} className='h-full w-full rounded-t-md' />
				</figure>
				<section className='flex flex-col gap-5 px-6 py-[40px]'>
					<h2 className='w-fit border-b border-primary text-sm font-medium uppercase leading-normal'>
						{difficulty}
					</h2>
					<h3 className='text-[20px] font-bold leading-normal'>{title}</h3>
					<p className='font-medium leading-6 text-[#8C8C8C]'>{brief}</p>
					<div className='flex flex-wrap items-center gap-[10px]'>
						{technologies.map((technology, index) => (
							<Badge key={index} className='text-sm uppercase'>
								{technology}
							</Badge>
						))}
					</div>
				</section>
			</article>
		</Link>
	)
}

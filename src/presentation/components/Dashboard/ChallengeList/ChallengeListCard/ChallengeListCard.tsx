import Link from 'next/link'
import { DeleteButton } from './DeleteButton'
import { Button } from '@components/ui/button'

interface ChallengeListCardProps {
	id: string
	image: string
	title: string
}

export const ChallengeListCard: React.FC<ChallengeListCardProps> = ({
	image,
	title,
	id
}) => {
	return (
		<section className='flex items-center justify-between rounded-md bg-secondary px-3 py-2'>
			<div className='flex items-center gap-0 sm:gap-7'>
				<Link href={`/desafios/${id}`}>
					<figure className='hidden h-14 w-20 sm:block'>
						<img
							src={image}
							alt={`Imagem do Projeto ${title}`}
							className='h-full w-full rounded-md'
						/>
					</figure>
				</Link>
				<h3>{title}</h3>
			</div>
			<div className='flex gap-3'>
				<DeleteButton id={id} />
				<Button asChild>
					<Link href={`/dashboard/project/${id}`}>Editar</Link>
				</Button>
			</div>
		</section>
	)
}

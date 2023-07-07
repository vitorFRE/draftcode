'use client'

import React from 'react'

import { z } from 'zod'
import { Button } from '@components/ui/button'
import { useToast } from '@components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'

import { Widget } from '@uploadcare/react-widget'

import { ProjectFormInput } from './ProjectFormInput'
import { ProjectFormTextarea } from './ProjectFormTextarea'

const FIGMA_REGEX =
	/https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/

const ProjectSchema = z.object({
	title: z
		.string()
		.min(6, {
			message: 'O nome do projeto deve ter no mínimo 6 caracteres'
		})
		.nonempty(),
	image: z.string(),
	brief: z.string().min(10, { message: 'A descrição deve ter no mínimo 10 caracteres' }),
	figma_url: z.string().regex(FIGMA_REGEX, {
		message: 'O link do figma deve ser válido'
	}),
	difficulty: z.string().nonempty({
		message: 'O nível do projeto deve ser informado'
	}),
	description: z.string().min(10, {
		message: 'A descrição deve ter no mínimo 10 caracteres'
	}),
	technologies: z.string().transform((value) => {
		if (typeof value === 'string') {
			return value.split(' ')
		}
	})
})

type ProjectData = z.infer<typeof ProjectSchema>

export default function ProjectForm() {
	const { toast } = useToast()
	const UPLOADCARE_API_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY as string

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<ProjectData>({
		resolver: zodResolver(ProjectSchema)
	})

	const onSubmit = async (data: ProjectData) => {
		try {
			const response = await fetch('/api/project', {
				method: 'POST',
				body: JSON.stringify(data)
			})

			await response.json()

			toast({
				title: 'Projeto criado com sucesso',
				description: 'Seu projeto foi criado com sucesso'
			})

			reset()
		} catch (error) {
			toast({
				title: 'Erro ao criar projeto',
				description: 'Verifique os campos e tente novamente'
			})
		}
	}

	React.useEffect(() => {
		if (Object.entries(errors).length > 0) {
			toast({
				title: 'Erro ao criar projeto',
				description: 'Verifique os campos e tente novamente'
			})
		}
	}, [errors, toast])

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='container'>
			<div className='mb-10 gap-10 md:flex'>
				<div className='hidden w-full max-w-xs md:block'>
					<h3 className='text-2xl font-bold leading-[46px]'>Nome, Linguagem e Nível</h3>
					<p>Insira o nome do desafio, sua linguagem e nível requerido</p>
				</div>
				<div className='flex-1'>
					<ProjectFormInput
						htmlFor='nome-desafio'
						type='text'
						label='Nome do Desafio'
						placeholder='Nome do Desafio'
						helperText='Escolha um nome para o desafio'
						{...register('title')}
					/>

					<div className='flex gap-5'>
						<ProjectFormInput
							htmlFor='linguagem-desafio'
							type='text'
							label='Linguagem'
							placeholder='Linguagens'
							helperText='Escolha uma ou mais linguagens para o desafio separadas por espaço'
							{...register('technologies')}
						/>

						<ProjectFormInput
							htmlFor='nivel-desafio'
							type='text'
							label='Nível'
							placeholder='Nível'
							helperText='Escolha um nível para o desafio (Iniciante, Intermediário, Avançado)'
							{...register('difficulty')}
						/>
					</div>
				</div>
			</div>

			<div className='mb-10 flex flex-col gap-10 md:flex-row'>
				<div className='hidden w-full max-w-xs md:block'>
					<h3 className='text-2xl font-bold leading-[46px]'>Imagem</h3>
					<p>Insira uma Imagem que mostre a tela final do desafio</p>
				</div>
				<div className='flex-1'>
					<Controller
						control={control}
						name='image'
						rules={{ required: 'Imagem é obrigatório' }}
						render={({ field: { onChange, ...field } }) => {
							return (
								<Widget
									{...field}
									imagesOnly
									locale='pt'
									clearable
									publicKey={UPLOADCARE_API_KEY}
									onChange={(file) => {
										onChange(file.cdnUrl as string)
									}}
								/>
							)
						}}
					/>
				</div>
			</div>

			<div className='mb-10 flex flex-col gap-10 md:flex-row'>
				<div className='hidden w-full max-w-xs md:block'>
					<h3 className='text-2xl font-bold leading-[46px]'>Link para o Figma</h3>
					<p>Utilize um link que leve ao figma do desafio para ser utilizado</p>
				</div>

				<ProjectFormInput
					htmlFor='figma-desafio'
					type='text'
					label='Figma'
					placeholder='Link para o Figma'
					helperText='Insira um link para o figma do desafio, deve ser um link válido'
					{...register('figma_url')}
				/>
			</div>

			<div className='mb-10 flex flex-col gap-10 md:flex-row'>
				<div className='hidden w-full max-w-xs md:block'>
					<h3 className='text-2xl font-bold leading-[46px]'>Descrição</h3>
					<p>Insira uma descrição sobre o desafio, informe o objetivo do mesmo</p>
				</div>

				<ProjectFormTextarea
					htmlFor='descricao-desafio'
					label='Descrição'
					placeholder='Neste desafio, você será desafiado a criar um formulário de login responsivo usando HTML, CSS e JavaScript. O formulário deve ter uma aparência agradável em dispositivos de desktop e móveis e deve ser fácil de usar para os usuários.'
					helperText='Insira uma descrição sobre o desafio, informe o objetivo do mesmo'
					{...register('brief')}
				/>
			</div>

			<div className='mb-10 flex flex-col gap-10 md:flex-row'>
				<div className='hidden w-full max-w-xs md:block'>
					<h3 className='text-2xl font-bold leading-[46px]'>Requisitos</h3>
					<p>
						Informe para os usuarios as tasks que devem ser completadas para finalizar o
						desafio
					</p>
				</div>

				<ProjectFormTextarea
					htmlFor='requisitos-desafio'
					label='Requisitos'
					placeholder='Você deve criar uma interface de usuário para um aplicativo de lista de tarefas simples. Ele deve consistir em um campo de entrada de texto, um botão "Adicionar" e uma lista de tarefas. Cada item da lista deve ter um botão "Excluir" que remova o item da lista. Você deve usar HTML, CSS e JavaScript para este projeto. Você não deve usar bibliotecas ou frameworks.'
					helperText='Informe para os usuarios as tasks que devem ser completadas para finalizar o
					desafio'
					{...register('description')}
				/>
			</div>

			<Button className='mx-auto block w-fit uppercase md:ml-auto md:mr-0'>Criar</Button>
		</form>
	)
}

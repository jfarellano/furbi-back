import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientFormDto } from './dto/create-client-form.dto';
import { UpdateClientFormDto } from './dto/update-client-form.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientForm } from './entities/client-form.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class ClientFormsService {
  constructor(
    @InjectRepository(ClientForm)
    private clientFormsRepository: Repository<ClientForm>,
    private readonly clientsService: ClientsService
  ) {}

  create(createClientDto: CreateClientFormDto) {
    return this.clientFormsRepository.save(createClientDto)
  }

  findAll() {
    return this.clientFormsRepository.find();
  }

  async findOneOrCreate(id: number) {
    const client = await this.clientsService.findOne(id)
    if(!client) throw new NotFoundException()

    const form = await this.clientFormsRepository.findOneBy({ client });

    if(form) return form
    return this.clientFormsRepository.save({client})
  }

  async update(id: number, updateClientDto: UpdateClientFormDto) {
    return await this.clientFormsRepository.update(id, updateClientDto)
    
  }

  async remove(id: number) {
    return await this.clientFormsRepository.delete(id);
  }

  async getQaa1(id: number) {
    const client = await this.clientsService.findOne(id)
    if(!client) throw new NotFoundException()

    const form = await this.clientFormsRepository.findOneBy({ client });
    if(!form) throw new NotFoundException()

    let qaa1 = ""

    qaa1 += `1. ¿Qué tipo de organización es? ${form.organizationType}\n`
    qaa1 += `2. ¿Qué tipo de clientes tiene la organización? ${form.clientTypes}\n`
    qaa1 += `3. Listar lo que ofrece o hace la organización en general: ${form.offer.join(', ')}\n`
    qaa1 += `4. ¿Trabajamos para toda la organización o para un área específica? ${form.organizarionAreas.join(', ')}\n`
    qaa1 += `5. ¿La organizacion vende productos, servicios o ambos? ${form.offering.join(', ')}\n`
    qaa1 += '6. Listar y describir el tipo de clientes a los que se dirigen. \n'
    form.target.forEach(target => {
      qaa1 += `* ${target}\n`
    })
    qaa1 += `7. ¿Los usuarios son los mismos que los clientes? ${form.clients}\n`
    if(form.clients == "SI" || form.clients == "HIBRIDO") {
      qaa1 += `8. ¿Quiénes son los clientes?\n`
      form.buyer.forEach(buyer => {
        qaa1 += `* ${buyer.client}: ${buyer.description}\n`
      })
    }
    if(form.clients == "NO" || form.clients == "HIBRIDO") {
      qaa1 += `8. ¿Quiénes son los usuarios?\n`
      form.users.forEach(user => {
        qaa1 += `* ${user.client}: ${user.description}\n`
      })
    }
    qaa1 += `9. ¿Qué problemas solucionas para tus usuarios/clientes?\n`
    form.solve.forEach(solution => {
      qaa1 += `* ${solution.client}: ${solution.solve}\n`
    })

    return qaa1
  }

  async getQaa2(id: number) {
    const client = await this.clientsService.findOne(id)
    if(!client) throw new NotFoundException()

    const form = await this.clientFormsRepository.findOneBy({ client });
    if(!form) throw new NotFoundException()

    let qaa2 = ""

    if(form.markets)
      qaa2 += `* ¿A qué mercados te diriges? ${form.markets}\n`

    if(form.marketSize)
      qaa2 +=  `* ¿Conoces el tamaño del mercado al que te diriges? ${form.marketSize}\n`

    qaa2 += `* ¿Hay otros públicos con los que sea relevante comunicarte además de los posibles compradores? En este caso qué problema le resuelves y qué tienes para ofrecerle:\n`
    form.otherPublics.forEach(otherPublic => {
      qaa2 += `- El cliente ${otherPublic.client}. Ofrece: ${otherPublic.offer}. Soluciona: ${otherPublic.solve}\n`
    })

    if(form.buyingPatterns)
      qaa2 += `* ¿Hay patrones de compra por temporada que afectan a tus ventas? ${form.buyingPatterns}\n`

    if(form.clientTimeExpectancy)
      qaa2 += `* ¿Cuál es el valor del tiempo de vida de uno de tus clientes? ${form.clientTimeExpectancy}\n`

    if(form.ticketAverage)
      qaa2 += `* ¿Cuál es el ticket promedio de cada servicio? ${form.ticketAverage}\n`

    if(form.priceComparison)
      qaa2 += `* ¿Cómo es tu precio respecto a la competencia? ${form.priceComparison}\n`

    qaa2 += `* ¿Qué te gustaría que el público sepa, sienta y/o haga?\n`
    form.publicActions.forEach(action => {
      qaa2 += `- El cliente ${action.client}: `
      if(action.do) qaa2 += `Haga: ${action.do} `
      if(action.feel) qaa2 += `Sienta: ${action.feel} `
      if(action.know) qaa2 += `Sepa: ${action.know} `
      qaa2 += `\n`
    })

    qaa2 += `* ¿Qué tipo de resultados medibles esperas obtener? ¿En qué tiempo?\n`
    form.kpi.forEach(kpi => {
      qaa2 += `- El objetivo ${kpi.objective} se busca obtener en ${kpi.timeFrame} con el kpi ${kpi.kpi}\n`
    })

    if(form.marketingTechnics) {
      qaa2 += `* De las siguientes técnicas de marketing, cuáles creemos que son las más adecuadas para llegar a los objetivos.\n`
      form.marketingTechnics.forEach(technique => {
        qaa2 += `- ${technique.technics}: ${technique.description}\n`
      })
    }

    qaa2 += `* ¿Qué métricas de marketing monitorizan en la actualidad? ${form.monitoredKpis.join(', ')}\n`

    if(form.roiStrategies) {
      qaa2 += `* ¿Qué estrategias fueron las más exitosas o produjeron más ROI para tu empresa en el año anterior?\n`
      form.roiStrategies.forEach(strategy => {
        qaa2 += `- ${strategy}\n`
      })
    }

    if(form.growthObjective)
      qaa2 += `* ¿Cuál es tu objetivo de crecimiento en ventas? ${form.growthObjective}\n`

    qaa2 += `* ¿Qué touch points tienes actualmente y cuáles te parece importante incorporar?\n`
    form.touchPoints.forEach(touchPoint => {
      qaa2 += `- ${touchPoint.media}: ${touchPoint.description}\n`
    })

    if(form.opposition) {
      qaa2 += `* ¿Quién es la competencia?\n`
      form.opposition.forEach(oppo => {
        qaa2 += `- ${oppo.name}: ${oppo.description}\n`
      })
    }

    if(form.oppositionMarketing)
      qaa2 += `* ¿Qué marketing creó la competencia que desearías haber creado tú? ${form.oppositionMarketing}\n`
      
    qaa2 += `* ¿Qué hace que tu empresa sea única en el mercado? ${form.uniqueness}\n`
    qaa2 += `* ¿Por qué característica quieres que tu empresa sea conocida en el mercado? ${form.recognizedCharacteristic}\n`

    if(form.vision)
      qaa2 += `* ¿Cuál es la visión que tienes de tu empresa a 3 años? ¿Y a 10? ${form.vision}`

    return qaa2
  }
}

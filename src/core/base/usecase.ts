export abstract class BaseUseCase<IRequest, IResponse> {
    abstract execute(request?: IRequest): Promise<IResponse> | IResponse;
}
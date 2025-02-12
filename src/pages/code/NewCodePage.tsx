import "./NewCodePage.css";

import { UploadResult } from "@cosmjs/cosmwasm-stargate";
import { calculateFee } from "@cosmjs/stargate";
import React from "react";
import { Link } from "react-router-dom";

import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { ClientContext } from "../../contexts/ClientContext";
import { Result } from "../contract/ContractPage";
import { CodeLink } from "../../components/CodeLink";
import { TransactionLink } from "../../components/TransactionLink";
import { settings } from "../../settings";

export function NewCodePage(): JSX.Element {
  const { userAddress, signingClient } = React.useContext(ClientContext);
  const [wasm, setWasm] = React.useState<File | null>();
  const [memo, setMemo] = React.useState<string>();

  const [executing, setExecuting] = React.useState(false);
  const [executeResponse, setExecuteResponse] = React.useState<Result<UploadResult>>();
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    if (executeResponse?.error) {
      setError(executeResponse.error);
      return;
    }

    setError(undefined);
  }, [executeResponse]);

  async function uploadCode(): Promise<void> {
    if (!userAddress || !wasm || !signingClient) return;

    setExecuting(true);
    const wasmBytes = new Uint8Array(await wasm.arrayBuffer());
    try {
      const executeResponseResult: UploadResult = await signingClient.upload(
        userAddress,
        wasmBytes,
        calculateFee(2000000, settings.backend.gasPrice),
        memo
      );
      setExecuteResponse({ result: executeResponseResult });
    } catch (error) {
      setExecuteResponse({ error: `Execute error: ${error.message}` });
    }

    setExecuting(false);
  }

  return (
    <div className="page">
      <Header />
      <div className="container mt-3">
        <div className="row white-row white-row-first">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/codes">Codes</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  New Code
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row white-row white-row-last">
          <div className="col">
            <div className="card mb-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex align-items-baseline">
                  <span>New Wasm Code</span>
                </li>
                <li className="list-group-item d-flex align-items-baseline">
                  <span title="The wasm code">Wasm:</span>
                  <div className="file btn btn-secondary">
                    {wasm?.name ?? "Select file"}
                    <input
                      type="file"
                      accept=".wasm"
                      className="ml-3 flex-grow-1 form-control-file"
                      onChange={(e) => setWasm(e.target.files?.item(0))}
                    />
                  </div>
                </li>
                <li className="list-group-item d-flex align-items-baseline">
                  <label title="The tx memo">Memo:</label>
                  <input
                    className="ml-3 flex-grow-1 form-control"
                    value={memo}
                    onChange={(event) => setMemo(event.target.value)}
                  />
                </li>
                <div className="list-group-item btn-group">
                  {executing ? (
                    <button className="btn btn-primary" type="button" disabled>
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Executing...
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={uploadCode} disabled={!signingClient}>
                      Upload
                    </button>
                  )}
                </div>
                {executeResponse?.result ? (
                  <>
                    <li className="list-group-item">
                      <span className="font-weight-bold">Response:</span>
                    </li>
                    <li className="list-group-item">
                      <div className="row mb-3">
                        <div className="col-md-2">
                          <span>Code ID:</span>
                        </div>
                        <div className="col-md-10">
                          <CodeLink codeId={executeResponse.result.codeId} text={"#" + executeResponse.result.codeId} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <span>Transaction:</span>
                        </div>
                        <div className="col-md-10">
                          <TransactionLink transactionId={executeResponse.result.transactionHash} maxLength={99} />
                        </div>
                      </div>
                    </li>
                  </>
                ) : null}
                {error ? (
                  <li className="list-group-item">
                    <span className="text-danger" title="The contract query error">
                      {error}
                    </span>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
        <FooterRow />
      </div>
    </div>
  );
}
